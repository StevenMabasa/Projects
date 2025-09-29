import java.util.Scanner;

public class armstrong {

    public static int pow(int number){     //Creating a power function
        int result = number*number*number;
        return result;
    }

    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {
            int num = scanner.nextInt();
            int duplicate = num;
            int sum = 0;
            int digit;

            while (duplicate != 0) {
                digit = duplicate % 10;
                duplicate /= 10;
                sum += pow(digit);   //Using the function I created
            }

            if (sum == num) {
                System.out.println("YES");
            }

            else {
                System.out.println("NO");
            }
        }
    }
}
