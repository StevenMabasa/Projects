import java.util.Scanner;

public class numrev {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            int num = scanner.nextInt();
            int rev = 0;
            int rem;

            while (num > 0) {
                rem = num%10;
                rev = (rev*10)+rem;
                num /= 10;
            }

            System.out.println(rev);
        }
    }
}
