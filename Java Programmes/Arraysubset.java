import java.util.Vector;
import java.util.Scanner;

public class Arraysubset{
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {
            int total1 = scanner.nextInt();
            int total2 = scanner.nextInt();
            int num;

            Vector<Integer>a1 = new Vector<Integer>();
            System.out.println("Vector1 : ");
            for (int i=0; i<total1; i++) {
                num = scanner.nextInt();
                a1.add(num);
            }

            Vector<Integer>a2 = new Vector<Integer>();
            System.out.println("Vector2 : ");
            for (int j=0; j<total2; j++) {
                num = scanner.nextInt();
                a2.add(num);
            }

            for (int k=0; k<a2.size(); k++) {
                if (a1.contains(a2.elementAt(k))) {
                    if (k==a2.size()-1) {
                        System.out.println("YES");
                    }
                    else {
                        continue;
                    }
                }
                else {
                    System.out.println("NO");
                    break;
                }
            }
        }
    }
}
